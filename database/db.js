

const { Pool } = require('pg');

// ==============================================================================
// CẤU HÌNH POSTGRESQL
// ==============================================================================

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '20102006',
    database: 'Cold_Chain_Telemetry_System_DB'
});


// ==============================================================================
// KIỂM TRA KẾT NỐI DATABASE
// ==============================================================================

const testConnection = async () => {
    try {
        const client = await pool.connect();

        console.log('[OK] Đã kết nối thành công tới PostgreSQL');
        console.log('[DB] Database: Cold_Chain_Telemetry_System_DB');

        client.release();
    } catch (error) {
        console.error(
            '[LỖI] Không thể kết nối PostgreSQL:',
            error.message
        );
    }
};


// ==============================================================================
// QUERY
// Dùng cho SELECT nhiều dòng
// ==============================================================================

const query = async (sql, params = []) => {
    try {
        const result = await pool.query(sql, params);

        return result.rows;
    } catch (error) {
        console.error(
            '[LỖI] Raw SQL Query:',
            error.message
        );

        throw error;
    }
};


// ==============================================================================
// GET
// Dùng khi cần lấy 1 bản ghi
// ==============================================================================

const get = async (sql, params = []) => {
    try {
        const result = await pool.query(sql, params);

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];

    } catch (error) {
        console.error(
            '[LỖI] Raw SQL Get:',
            error.message
        );

        throw error;
    }
};


// ==============================================================================
// RUN
// Dùng cho INSERT / UPDATE / DELETE
// ==============================================================================

const run = async (sql, params = []) => {
    try {
        const result = await pool.query(sql, params);

        return {
            lastID:
                result.rows.length > 0
                    ? result.rows[0].id
                    : null,

            changes: result.rowCount
        };

    } catch (error) {
        console.error(
            '[LỖI] Raw SQL Run:',
            error.message
        );

        throw error;
    }
};


// ==============================================================================
// KHỞI TẠO / KIỂM TRA DATABASE
// ==============================================================================

const initDatabase = async () => {
    try {
        await pool.query('SELECT 1');

        console.log(
            '[OK] Cold Chain Database sẵn sàng hoạt động.'
        );

    } catch (error) {
        console.error(
            '[LỖI] Database Cold Chain:',
            error.message
        );
    }
};


// ==============================================================================
// KHỞI ĐỘNG
// ==============================================================================

testConnection();


// ==============================================================================
// EXPORT
// ==============================================================================

module.exports = {
    pool,
    query,
    get,
    run,
    initDatabase
};
