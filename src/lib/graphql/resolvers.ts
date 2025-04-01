// /lib/graphql/resolvers.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface CreateProjectArgs {
  title: string;
  creator_email: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails: string[];
  video_url: string;
  image_url: string;
}

interface CreateUserArgs {
  clerkId: string;
  email: string;
  secondaryEmail?: string; // will be mapped to secondaryEmail
  firstName?: string; // will be mapped to firstName
  lastName?: string; // will be mapped to lastName
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

interface UpdateUserArgs {
  email: string;
  secondaryEmail?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

interface UpdateUserData {
  secondaryEmail?: string | null;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

export const resolvers = {
  Query: {
    projects: async (_: unknown, { search }: { search?: string }) => {
      if (!search) return prisma.projects.findMany();
      return prisma.projects.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { competition: { contains: search, mode: "insensitive" } },
            { creator_email: { contains: search, mode: "insensitive" } }
          ]
        }
      });
    },
    project: async (
      _: unknown,
      { id, slug }: { id?: number; slug?: string }
    ) => {
      // Fetch the project record either by id or by slug
      const project = id
        ? await prisma.projects.findUnique({ where: { id } })
        : await prisma.projects.findFirst({
            where: { title: slug!.replace(/-/g, " ") }
          });

      if (!project) return null;

      // Fetch user details for each email in team_members_emails
      const teamMembers = await prisma.users.findMany({
        where: {
          email: {
            in: project.team_members_emails
          }
        }
      });

      // Return both the original email array and the new teamMembers object
      return {
        ...project,
        teamMembers // This adds a new field with full user details
      };
    },

    // project: async (
    //   _: unknown,
    //   { id, slug }: { id?: number; slug?: string }
    // ) => {
    //   if (id) return prisma.projects.findUnique({ where: { id } });
    //   if (slug) {
    //     return prisma.projects.findFirst({
    //       where: { title: slug.replace(/-/g, " ") }
    //     });
    //   }
    //   throw new Error("Either 'id' or 'slug' must be provided.");
    // },
    users: async () => prisma.users.findMany(),
    user: async (_: unknown, { id }: { id: number }) =>
      prisma.users.findUnique({ where: { id } }),
    getUserByClerkId: async (_: unknown, { clerkId }: { clerkId: string }) => {
      return prisma.users.findUnique({ where: { clerkId } });
    },
    projectsByEmail: {
      resolve: async (_: unknown, { email }: { email: string }) => {
        return prisma.projects.findMany({
          where: {
            OR: [
              { creator_email: { equals: email, mode: "insensitive" } },
              { team_members_emails: { has: email } }
            ]
          }
        });
      }
    }
  },

  Mutation: {
    createProject: async (_: unknown, args: CreateProjectArgs) => {
      return prisma.projects.create({ data: args });
    },
    createUser: async (_: unknown, args: CreateUserArgs) => {
      return prisma.users.create({
        data: {
          clerkId: args.clerkId, // store the Clerk id
          email: args.email,
          secondaryEmail: args.secondaryEmail || null,
          firstName: args.firstName,
          lastName: args.lastName,
          bio: args.bio || "",
          imageUrl: args.imageUrl,
          graduationYear: args.graduationYear || null,
          major: args.major || null
        }
      });
    },
    // NEW: deletion by Clerk id
    deleteUserByClerkId: async (
      _: unknown,
      { clerkId }: { clerkId: string }
    ) => {
      return prisma.users.delete({ where: { clerkId } });
    },
    updateUser: async (_: unknown, args: UpdateUserArgs) => {
      if (!args.email) {
        throw new Error("Email is required to update a user.");
      }

      // Build an update object that only includes fields that are defined
      const updateData: UpdateUserData = {};

      if (args.secondaryEmail !== undefined) {
        // Optionally, convert an empty string to null
        updateData.secondaryEmail =
          args.secondaryEmail.trim() === "" ? null : args.secondaryEmail;
      }
      if (args.firstName !== undefined) updateData.firstName = args.firstName;
      if (args.lastName !== undefined) updateData.lastName = args.lastName;
      if (args.bio !== undefined) updateData.bio = args.bio;
      if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
      if (args.graduationYear !== undefined)
        updateData.graduationYear = args.graduationYear;
      if (args.major !== undefined) updateData.major = args.major;

      return prisma.users.update({
        where: { email: args.email },
        data: updateData
      });
    },

    deleteUser: async (_: unknown, { id }: { id: number }) => {
      return prisma.users.delete({ where: { id } });
    },
    deleteUserByEmail: async (_: unknown, { email }: { email: string }) => {
      if (!email) {
        throw new Error("Email is required to delete a user.");
      }
      return prisma.users.delete({
        where: { email }
      });
    },
    updateProjectField: async (
      _: unknown,
      args: { id: number; key: string; newValue?: string }
    ) => {
      const { id, key, newValue } = args;
      const allowedFields = [
        "title",
        "short_description",
        "long_description",
        "competition",
        "video_url",
        "image_url"
      ];
      if (!allowedFields.includes(key)) {
        throw new Error(`Field ${key} cannot be updated.`);
      }
      const updateData: Partial<
        Record<(typeof allowedFields)[number], string>
      > = {
        [key]: newValue ?? ""
      };
      return prisma.projects.update({
        where: { id },
        data: updateData
      });
    },
    deleteProject: async (_: unknown, { id }: { id: number }) => {
      return prisma.projects.delete({ where: { id } });
    },
    addTeamMember: async (
      _: unknown,
      { id, email }: { id: number; email: string }
    ) => {
      const project = await prisma.projects.findUnique({ where: { id } });
      if (!project) throw new Error("Project not found");
      if (project.team_members_emails?.includes(email)) {
        return project;
      }
      const updatedEmails = [...(project.team_members_emails || []), email];
      return prisma.projects.update({
        where: { id },
        data: { team_members_emails: updatedEmails }
      });
    },
    removeTeamMember: async (
      _: unknown,
      { id, email }: { id: number; email: string }
    ) => {
      const project = await prisma.projects.findUnique({ where: { id } });
      if (!project) throw new Error("Project not found");
      const updatedEmails = (project.team_members_emails || []).filter(
        (e) => e !== email
      );
      return prisma.projects.update({
        where: { id },
        data: { team_members_emails: updatedEmails }
      });
    }
  }
};
