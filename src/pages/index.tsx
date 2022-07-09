import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { loginState, userState } from '../../atoms/login';
import { SubmitHandler, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Header'), {
  ssr: false,
});
const style = {
  title: 'flex text-2xl justify-center',
  navButton: 'flex flex-col cursor-pointer bg-blue-300 rounded-sm',
};
const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const postsQuery = trpc.useQuery(['post.all']);
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.all']);
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      title: '',
      text: '',
    },
  });
  interface IFormInput {
    title: string;
    text: string;
  }

  const [isLogin, setIsLogin] = useRecoilState(loginState);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await addPost.mutateAsync(data);
      reset();
    } catch {}
  };

  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
    }
  }, [isLogin, router]);
  return (
    <>
      <Header />

      <div className="flex space-x-2">
        <nav>
          <ul className={style.navButton}>
            <li>Home</li>
            <li>Jadwal Kuliah</li>
            <li>Setting</li>
            <li onClick={() => setIsLogin(false)}>Logout</li>
          </ul>
        </nav>
        <main className="flex flex-col flex-1">
          <h2 className={style.title}>
            Jadwal Kuliah
            {postsQuery.status === 'loading' && '(loading)'}
          </h2>
          {postsQuery.data?.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <Link href={`/post/${item.id}`}>
                <a>View more</a>
              </Link>
            </article>
          ))}

          <hr />

          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">Title:</label>
            <br />
            <input
              {...register('title')}
              type="text"
              disabled={addPost.isLoading}
            />

            <br />
            <label htmlFor="text">Text:</label>
            <br />
            <textarea {...register('text')} disabled={addPost.isLoading} />
            <br />
            <input type="submit" disabled={addPost.isLoading} />
            {addPost.error && (
              <p style={{ color: 'red' }}>{addPost.error.message}</p>
            )}
          </form>
        </main>
      </div>
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
