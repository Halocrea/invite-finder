import Database from 'better-sqlite3';
import path from 'path';

interface Server {
  serverId: string;
  logsChannelId: string;
}

const db = new Database(path.join(__dirname, '../../saves/server.db'));

const createServerDB = `CREATE TABLE IF NOT EXISTS server (
  serverId VARCHAR(30),
  logsChannelId INT(11)
)`;
db.exec(createServerDB);

export function addServer(serverId: string) {
  const newServer = 'INSERT INTO server (serverId) VALUES (@serverId)';
  db.prepare(newServer).run({ serverId });
}

export function editLogsChannelOnServer(server: Server) {
  const updateServer = 'UPDATE server SET logsChannelId = ? WHERE serverId = ?';
  db.prepare(updateServer).run([server.logsChannelId, server.serverId]);
}

export function getServers(): Server[] {
  const getServers = 'SELECT * FROM server';
  return db.prepare(getServers).all();
}

export function deleteServer(serverId: string) {
  const deleteServer = 'DELTE FROM server WHERE serverId = ?';
  db.prepare(deleteServer).run(serverId);
}
