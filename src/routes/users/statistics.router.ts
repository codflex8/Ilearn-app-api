import { Router } from "express";
import {
  getHomeStatistcs,
  getProfileStatistics,
  usersStatisticsReminder,
} from "../../controllers/users/statistics.controller";

const router = Router();

router.get("/home", getHomeStatistcs);
router.get("/reports", getProfileStatistics);
// Todo:remove this route after testing
// router.get("/all-users", async (req, res) => {
//   const data = await usersStatisticsReminder();
//   res.json(data);
// });
export default router;
