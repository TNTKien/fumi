const initSchema = async (pool) => {
  const users = pool.prepare(
    `CREATE TABLE IF NOT EXISTS users (
            discordID TEXT PRIMARY KEY NOT NULL UNIQUE,
            hsrID TEXT NOT NULL
        );`,
  );

  await pool.batch([users]);
};

export default initSchema;
