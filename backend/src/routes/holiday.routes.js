import { Router } from 'express';

function getHolidayPlannerServiceOrFail(deps) {
  if (!deps?.holidayPlannerService) {
    throw new Error('holidayPlannerService is required');
  }

  return deps.holidayPlannerService;
}

export function createHolidayRoutes(deps = {}) {
  const router = Router();
  const holidayPlannerService = getHolidayPlannerServiceOrFail(deps);

  router.get('/', async (req, res, next) => {
    try {
      const userId = String(req.query.userId ?? '').trim();

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const requests = await holidayPlannerService.listRequestsByUser(userId);
      return res.json({ data: requests });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/pending', async (_req, res, next) => {
    try {
      const requests = await holidayPlannerService.listPendingRequests();
      return res.json({ data: requests });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const request = await holidayPlannerService.createRequest(req.body);
      return res.status(201).json({ data: request });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/:requestId/approve', async (req, res, next) => {
    try {
      const request = await holidayPlannerService.approveRequest({
        requestId: req.params.requestId,
        actorId: req.body.actorId,
        note: req.body.note
      });
      return res.json({ data: request });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/:requestId/reject', async (req, res, next) => {
    try {
      const request = await holidayPlannerService.rejectRequest({
        requestId: req.params.requestId,
        actorId: req.body.actorId,
        note: req.body.note
      });
      return res.json({ data: request });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/:requestId/cancel', async (req, res, next) => {
    try {
      const request = await holidayPlannerService.cancelRequest({
        requestId: req.params.requestId,
        actorId: req.body.actorId,
        note: req.body.note
      });
      return res.json({ data: request });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export default createHolidayRoutes;
