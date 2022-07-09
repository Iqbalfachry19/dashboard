import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  nim: true,
  nama: true,
  password: true,
  createdAt: true,
  updatedAt: true,
});
export const loginRouter = createRouter()
  .query('byNim', {
    input: z.object({
      nim: z.string(),
    }),
    async resolve({ input }) {
      const { nim } = input;
      const user = await prisma.user.findUnique({
        where: { nim },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with nim '${nim}'`,
        });
      }
      return user;
    },
  })
  .mutation('create', {
    input: z.object({
      id: z.string().uuid().optional(),
      nim: z.string().min(1).max(32),
      password: z.string().min(1),
    }),
    async resolve({ input }) {
      const post = await prisma.user.create({
        data: input,
        select: defaultUserSelect,
      });
      return post;
    },
  });
