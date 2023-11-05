// 
import connection from './db.js';
import middleware from '@/cors.js';
export default async function (req,res) {
  try {
    await middleware(req,res);
    if (req.method === 'GET') {
      const { rollNo } = req.query;
      const results = await new Promise((resolve,reject) => {
        connection.query(` SELECT
         subject.subject_id,
            subject.subject_name,
            subject.teachername,
            subject.classroom_id,
            COUNT(CASE WHEN attendance_details.PorA = 'P' THEN 1 ELSE NULL END) AS P_count,
            COUNT(CASE WHEN attendance_details.PorA = 'A' THEN 1 ELSE NULL END) AS A_count,
            (COUNT(CASE WHEN attendance_details.PorA = 'P' THEN 1 ELSE NULL END) / COUNT(*)) * 100 AS attendance_percent
        FROM subject
        JOIN attendance_details ON subject.subject_id = attendance_details.subject_id
        WHERE attendance_details.roll_no = ${rollNo}
        GROUP BY subject.subject_id, subject.subject_name, subject.teachername, subject.classroom_id;`,(error,results) => {
          (error,results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          };
        });
      });
      res.status(200).json(results);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  } finally {
    res.end();
  }
};
