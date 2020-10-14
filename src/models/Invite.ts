import Database from 'better-sqlite3';
import path from 'path';

interface Invite {
  code: string;
  uses: number;
}

const db = new Database(path.join(__dirname, '../../saves/last_bump.db'));

const createInviteDB = `CREATE TABLE IF NOT EXISTS invite (
  code VARCHAR(30),
  uses INT(11)
)`;
db.exec(createInviteDB);

export function addInvite(invite: Invite) {
  const newInvite = 'INSERT INTO invite (code, uses) VALUES (@code, @uses)';
  return db.prepare(newInvite).run(invite);
}

export function getInvites() {
  const getInvites = 'SELECT * FROM invite';
  return db.prepare(getInvites).all();
}

export function deleteInvite(code: string) {
  const deleteInvite = 'DELTE FROM invite WHERE code = ?';
  return db.prepare(deleteInvite).run(code);
}