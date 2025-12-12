// GET /api/todos - Get all todos
// POST /api/todos - Create new todo

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM todos ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify({ todos: results }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch todos', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function onRequestPost(context) {
  try {
    const { title, description } = await context.request.json();

    if (!title || title.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert new todo
    const result = await context.env.DB.prepare(
      'INSERT INTO todos (title, description, completed) VALUES (?, ?, 0)'
    )
      .bind(title.trim(), description ? description.trim() : null)
      .run();

    // Fetch the created todo
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM todos WHERE id = ?'
    )
      .bind(result.meta.last_row_id)
      .all();

    return new Response(
      JSON.stringify({ todo: results[0] }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create todo', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
