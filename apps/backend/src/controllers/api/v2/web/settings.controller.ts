// Libraries
import { Request, Response, NextFunction } from "express";

// Errors
import { BadRequest, Forbidden } from "../../../../errors/api.error.js";

// Models
import { WebSetting } from "../../../../models/web.model.js";
import { User } from "../../../../models/user.model.js";

// Services
import { PermissionService } from "../../../../services/permission.service.js";

/**
 * Handles the GET request to retrieve a setting.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Setup web parameters
    const WebSettingInstance = WebSetting.getInstance();
    const setting = req.body.setting;

    // Check for required values
    if (!setting) {
      throw new BadRequest("Setting and value are required.");
    }

    // Retrieve setting
    const retrievedSetting = await WebSettingInstance.getSetting(setting);

    if (!retrievedSetting) {
      throw new BadRequest("Setting not found.");
    }

    res.status(200).json({ setting: setting, value: retrievedSetting });
  } catch (e) {
    next(e);
  }
};

/**
 * Handles the POST request to update a setting.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Setup web parameters
    const WebSettingInstance = WebSetting.getInstance();
    const setting = req.query.setting?.toString();
    const value = req.query.value?.toString();

    // Initialize user
    const contextUser = new User();
    await contextUser.init(req.body.jwt.sub);

    // Check for user permissions
    const userGroups = contextUser.getGroups();
    const groupIds = userGroups.map((group) => group.id);

    if (!PermissionService.checkPermission(groupIds, "admin")) {
      throw new Forbidden("You do not have permission to perform this action.");
    }

    // Check for required values
    if (!setting || !value) {
      throw new BadRequest("Setting and value are required.");
    }

    // Update setting
    const updateResult = await WebSettingInstance.updateSetting(setting, value);
    res.status(200).json({
      message: "Successfully updated setting.",
      setting: setting,
      value: updateResult,
    });
  } catch (e) {
    next(e);
  }
};
