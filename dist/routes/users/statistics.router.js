"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statistics_controller_1 = require("../../controllers/users/statistics.controller");
const router = (0, express_1.Router)();
router.get("/home", statistics_controller_1.getHomeStatistcs);
router.get("/reports", statistics_controller_1.getProfileStatistics);
// Todo:remove this route after testing
// router.get("/all-users", async (req, res) => {
//   const data = await usersStatisticsReminder();
//   res.json(data);
// });
exports.default = router;
//# sourceMappingURL=statistics.router.js.map