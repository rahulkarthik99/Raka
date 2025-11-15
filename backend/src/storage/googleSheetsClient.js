const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SPREADSHEET_ID = process.env.SHEETS_SPREADSHEET_ID;
const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const crypto = require('crypto');

const SHEET_NAME = 'Queue';
const HEADER_ROW = ['id', 'topic', 'caption', 'hashtags', 'image_prompt', 'image_url', 'platforms', 'scheduled_at', 'approved', 'status', 'post_id', 'response', 'created_at', 'last_attempt_at', 'attempts'];

const getClient = async () => {
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
    return sheets;
};

// Helper to convert sheet rows to objects
const rowsToObjects = (rows) => {
    if (!rows || rows.length === 0) return [];
    return rows.map(row => {
        const obj = {};
        HEADER_ROW.forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });
};

// Helper to convert an object to a sheet row
const objectToRow = (obj) => {
    return HEADER_ROW.map(header => obj[header] || '');
};

const getPosts = async () => {
    const client = await getClient();
    const res = await client.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:O`, // Assuming data starts from the second row
    });
    return rowsToObjects(res.data.values);
};

const getPost = async (id) => {
    const posts = await getPosts();
    return posts.find(post => post.id === id);
};

const createPost = async (post) => {
    const client = await getClient();
    const newPost = { id: crypto.randomBytes(16).toString('hex'), ...post };
    const row = objectToRow(newPost);
    await client.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [row],
        },
    });
    return newPost;
};

const updatePost = async (id, post) => {
    const client = await getClient();
    const posts = await getPosts();
    const rowIndex = posts.findIndex(p => p.id === id);
    if (rowIndex === -1) {
        throw new Error('Post not found');
    }

    const updatedPost = { ...posts[rowIndex], ...post };
    const row = objectToRow(updatedPost);

    await client.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex + 2}`, // +2 because of header and 0-indexing
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [row],
        },
    });
    return updatedPost;
};

const deletePost = async (id) => {
    const client = await getClient();
    const posts = await getPosts();
    const rowIndex = posts.findIndex(p => p.id === id);

    if (rowIndex === -1) {
        throw new Error('Post not found');
    }

    // This is a bit more complex. We need to issue a batch update to delete the row.
    const sheetId = await getSheetId(client, SHEET_NAME);
    if (sheetId === null) throw new Error('Sheet not found');

    await client.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: sheetId,
                        dimension: 'ROWS',
                        startIndex: rowIndex + 1, // +1 because data starts at row 2
                        endIndex: rowIndex + 2
                    }
                }
            }]
        }
    });

    return { id };
};

// Helper to get the sheetId needed for deletion
const getSheetId = async (client, sheetName) => {
    const res = await client.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
    });
    const sheet = res.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : null;
}


module.exports = {
  getClient,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
