const pool = require('../config/db');

/**
 * Generic reusable model to perform CRUD on any table.
 * Keeps the codebase DRY across the ~15 content modules.
 */
class GenericModel {
  constructor(table, primaryKey = 'id') {
    this.table = table;
    this.pk = primaryKey;
  }

  async all(orderBy = `${this.pk} DESC`) {
    const [rows] = await pool.query(`SELECT * FROM \`${this.table}\` ORDER BY ${orderBy}`);
    return rows;
  }

  async find(id) {
    const [rows] = await pool.query(`SELECT * FROM \`${this.table}\` WHERE \`${this.pk}\` = ?`, [id]);
    return rows[0];
  }

  async findBy(field, value) {
    const [rows] = await pool.query(`SELECT * FROM \`${this.table}\` WHERE \`${field}\` = ? LIMIT 1`, [value]);
    return rows[0];
  }

  async create(data) {
    const [result] = await pool.query(`INSERT INTO \`${this.table}\` SET ?`, [data]);
    return result.insertId;
  }

  async update(id, data) {
    await pool.query(`UPDATE \`${this.table}\` SET ? WHERE \`${this.pk}\` = ?`, [data, id]);
    return true;
  }

  async delete(id) {
    await pool.query(`DELETE FROM \`${this.table}\` WHERE \`${this.pk}\` = ?`, [id]);
    return true;
  }

  async count() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM \`${this.table}\``);
    return rows[0].total;
  }
}

module.exports = GenericModel;
