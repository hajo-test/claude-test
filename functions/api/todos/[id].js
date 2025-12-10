// PUT /api/todos/:id - Update todo
// DELETE /api/todos/:id - Delete todo

export async function onRequestPut(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();

    // Check if todo exists
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM todos WHERE id = ?'
    )
      .bind(id)
      .all();

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Todo not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update todo
    const updates = [];
    const values = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      values.push(body.title);
    }

    if (body.completed !== undefined) {
      updates.push('completed = ?');
      values.push(body.completed);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      await context.env.DB.prepare(
        `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`
      )
        .bind(...values)
        .run();
    }

    // Fetch updated todo
    const { results: updated } = await context.env.DB.prepare(
      'SELECT * FROM todos WHERE id = ?'
    )
      .bind(id)
      .all();

    return new Response(
      JSON.stringify({ todo: updated[0] }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update todo', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function onRequestDelete(context) {
  try {
    const id = context.params.id;

    // Check if todo exists
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM todos WHERE id = ?'
    )
      .bind(id)
      .all();

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Todo not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Delete todo
    await context.env.DB.prepare('DELETE FROM todos WHERE id = ?')
      .bind(id)
      .run();

    return new Response(
      JSON.stringify({ message: 'Todo deleted successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete todo', message: error.message }),
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
