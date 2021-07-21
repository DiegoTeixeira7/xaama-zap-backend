import { Request, Response, NextFunction } from "express";
import { rooms } from '../entities/Room';
import { AppError } from '../errors/AppError';

export async function ensureAdminRoom(request: Request, response: Response, next: NextFunction) {
  const { roomId } = request.params;
  const { userId } = request;
  let isAdmin = false;

  if (!roomId) {
    throw new AppError("Room ID is empty");
  }

  const { usersIdAdmin } = await rooms.findById(roomId);

  usersIdAdmin.forEach(uId => {
    if (uId.toString() === userId) {
      isAdmin = true;
    }
  });

  if (isAdmin) {
    return next();
  }

  throw new AppError("User is not admin the this room");
}
