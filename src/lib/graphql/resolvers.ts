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
  email: string;
  name?: string;
  bio?: string;
}

interface UpdateUserArgs {
  id: number;
  name?: string;
  bio?: string;
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
      if (id) return prisma.projects.findUnique({ where: { id } });
      if (slug) {
        return prisma.projects.findFirst({
          where: { title: slug.replace(/-/g, " ") }
        });
      }
      throw new Error("Either 'id' or 'slug' must be provided.");
    },
    users: async () => prisma.users.findMany(),
    user: async (_: unknown, { id }: { id: number }) =>
      prisma.users.findUnique({ where: { id } })
  },

  Mutation: {
    createProject: async (_: unknown, args: CreateProjectArgs) => {
      return prisma.projects.create({ data: args });
    },
    createUser: async (_: unknown, args: CreateUserArgs) => {
      return prisma.users.create({
        data: {
          email: args.email,
          name: args.name || "",
          bio: args.bio ?? ""
        }
      });
    },
    updateUser: async (_: unknown, args: UpdateUserArgs) => {
      return prisma.users.update({
        where: { id: args.id },
        data: {
          name: args.name,
          bio: args.bio ?? ""
        }
      });
    },
    deleteUser: async (_: unknown, { id }: { id: number }) => {
      return prisma.users.delete({ where: { id } });
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
