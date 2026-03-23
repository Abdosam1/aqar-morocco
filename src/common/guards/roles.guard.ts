import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../shared/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // System Admin always has access
        if (user?.role === UserRole.ADMIN) return true;

        // Check if any required role matches system role or business roles
        return requiredRoles.some((role) => {
            if (user?.role === role) return true;

            // Business logic: if OWNER is required, allow sellers, landlords, and agencies
            if (role === UserRole.OWNER) {
                const businessRoles = ['seller', 'landlord', 'agency'];
                return user?.app_roles?.some(r => businessRoles.includes(r));
            }

            return false;
        });
    }
}
