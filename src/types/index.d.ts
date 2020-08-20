import { Request, Response, NextFunction } from "express";

type Route = (i: Request, o: Response, n?: NextFunction) => void | Promise<void> | Express.Response
