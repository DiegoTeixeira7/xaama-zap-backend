import { Request, Response, NextFunction } from "express";
import { rooms } from '../entities/Room';
import { AppError } from 'src/errors/AppError';

export async function ensureParticipatesRoom(request: Request, response: Response, next: NextFunction) {
  const { roomId } = request.params;
  const { userId } = request;
  let isParticipate = false;

  if (!roomId) {
    throw new AppError("Room ID is empty");
  }

  try {
    var { usersId } = await rooms.findById(roomId);
  } catch (error) {
    throw new AppError("Room not found");
  }

  if (!usersId) {
    throw new AppError("Room is not exists");
  }

  usersId.forEach(uId => {
    if (uId.toString() === userId) {
      isParticipate = true;
    }
  });

  if (isParticipate) {
    return next();
  }

  throw new AppError("User is not part of this room");
}
