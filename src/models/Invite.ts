import Database from 'better-sqlite3';
import path from 'path';

interface Invite {
  serverId: string;
  code: string;
  uses: number;
}

const db = new Database(path.join(__dirname, '../../saves/invite.db'));

const createInviteDB = `CREATE TABLE IF NOT EXISTS invite (
  serverId VARCHAR(30),
  code VARCHAR(30),
  uses INT(11)
)`;
db.exec(createInviteDB);

export function addInvite(invite: Invite) {
  const newInvite = 'INSERT INTO invite (serverId, code, uses) VALUES (@serverId, @code, @uses)';
  db.prepare(newInvite).run(invite);
}

export function getInvitesFromServer(serverId: string): Invite[] {
  const getInvites = 'SELECT * FROM invite WHERE serverId = ?';
  return db.prepare(getInvites).all(serverId);
}

export function editInviteUses(invite: Invite) {
  const editInvite = 'UPDATE invite SET uses = ? WHERE serverId = ? AND code = ?';
  db.prepare(editInvite).run([invite.uses, invite.serverId, invite.code]);
}

export function deleteInvite(code: string) {
  const deleteInvite = 'DELTE FROM invite WHERE code = ?';
  db.prepare(deleteInvite).run(code);
}

export function deleteAllInvitesFromServer(serverId: string) {
  const deleteInvites = 'DELETE FROM invite WHERE serverId = ?';
  db.prepare(deleteInvites).run(serverId);
}