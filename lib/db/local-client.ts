import { execSync } from "child_process";

// Local D1 client for development
// This allows us to use npm run dev while accessing the local D1 database

export async function executeLocalD1Query(
  query: string
): Promise<Record<string, string>[]> {
  try {
    const result = execSync(
      `npx wrangler d1 execute personal-website --local --command="${query.replace(
        /"/g,
        '\\"'
      )}"`,
      { encoding: "utf8" }
    );

    if (!result) {
      return [];
    }

    // Parse the result (this is a simplified parser)
    const lines = result.split("\n");

    const dataStart = lines.findIndex((line: string) => line.includes("│"));

    if (dataStart === -1) {
      return [];
    }

    // Extract headers
    const headerLine = lines[dataStart - 1];

    const headers = headerLine
      .split("│")
      .map((h: string) => h.trim())
      .filter((h: string) => h);

    // Extract data rows
    const dataRows: Record<string, string>[] = [];
    for (let i = dataStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("└──") || line.includes("┌──")) break;
      if (line.includes("│")) {
        const values = line
          .split("│")
          .map((v: string) => v.trim())
          .filter((v: string) => v);
        if (values.length === headers.length) {
          const row: Record<string, string> = {};
          headers.forEach((header: string, index: number) => {
            row[header] = values[index];
          });
          dataRows.push(row);
        }
      }
    }

    return dataRows;
  } catch (error) {
    console.error("Local D1 query failed:", error);
    throw error;
  }
}

export async function findUserByEmailLocal(
  email: string
): Promise<Record<string, string> | null> {
  try {
    const query = `SELECT * FROM users WHERE email = '${email}';`;
    const results = await executeLocalD1Query(query);
    return results[0] || null;
  } catch (error) {
    throw error;
  }
}

export async function insertUserLocal(userData: {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}): Promise<Record<string, string>[]> {
  const query = `INSERT INTO users (id, email, password, first_name, last_name, role, status, created_at) VALUES ('${userData.id}', '${userData.email}', '${userData.password}', '${userData.firstName}', '${userData.lastName}', '${userData.role}', '${userData.status}', unixepoch());`;
  return executeLocalD1Query(query);
}

export async function getPendingUsersLocal(): Promise<
  Record<string, string>[]
> {
  const query = `SELECT * FROM users WHERE status = 'pending' ORDER BY created_at DESC;`;
  return executeLocalD1Query(query);
}

export async function approveUserLocal(
  id: string
): Promise<Record<string, string>[]> {
  const query = `UPDATE users SET status = 'approved', updated_at = unixepoch() WHERE id = '${id}';`;
  return executeLocalD1Query(query);
}

export async function rejectUserLocal(
  id: string
): Promise<Record<string, string>[]> {
  const query = `UPDATE users SET status = 'rejected', updated_at = unixepoch() WHERE id = '${id}';`;
  return executeLocalD1Query(query);
}

export async function updateUserRoleLocal(
  id: string,
  role: string
): Promise<Record<string, string>[]> {
  const query = `UPDATE users SET role = '${role}', updated_at = unixepoch() WHERE id = '${id}';`;
  return executeLocalD1Query(query);
}
