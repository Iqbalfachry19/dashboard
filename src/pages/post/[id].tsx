import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const PostViewPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  const postDelete = trpc.useMutation(['post.delete']);
  const postEdit = trpc.useMutation('post.edit', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.byId', { id }]);
    },
  });
  const router = useRouter();
  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }
  const handlerDelete = () => {
    postDelete.mutate({ id });
    router.push('/');
  };

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.text}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <button onClick={handlerDelete}>Delete</button>
      <hr />
      <h1>Edit</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */

          const $text: HTMLInputElement = (e as any).target.elements.text;
          const $title: HTMLInputElement = (e as any).target.elements.title;
          const data = {
            title: $title.value,
            text: $text.value,
          };
          const input = {
            id,
            data,
          };
          try {
            postEdit.mutate(input);

            $title.value = '';
            $text.value = '';
          } catch {}
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          disabled={postEdit.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <textarea id="text" name="text" disabled={postEdit.isLoading} />
        <br />
        <input type="submit" disabled={postEdit.isLoading} />
        {postEdit.error && (
          <p style={{ color: 'red' }}>{postEdit.error.message}</p>
        )}
      </form>
    </>
  );
};

export default PostViewPage;
