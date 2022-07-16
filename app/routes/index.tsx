import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { momento } from '~/utils/momentoClient';

type Todo = {
  id: number;
  title: string;
};

type LoaderData = {
  todos: Todo[];
};

export const loader = async () => {
  // myTodoというネームスペースのキャッシュを利用
  const CACHE_NAME = 'myTodo';

  // momentoにキャッシュデータがあるか確認
  const cacheResponse = await momento.get(CACHE_NAME, 'todos');
  const cacheData = cacheResponse.text();

  // キャッシュデータがあればそれを返す
  if (cacheData) {
    return json<LoaderData>({ todos: JSON.parse(cacheData) });
  }

  // キャッシュデータがない場合は取得
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await response.json();

  /**
   * キャッシュに格納
   * @param cacheName キャッシュのネームスペース
   * @param key キャッシュのキー
   * @param value キャッシュに格納するデータ
   * @param ttl キャッシュの有効期限
   */
  await momento.set(CACHE_NAME, 'todos', JSON.stringify(todos), 60);

  // 取得したデータを返す
  return json<LoaderData>({ todos });
};

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        {todos && todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}
