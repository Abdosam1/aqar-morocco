import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsArray } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;

    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @Matches(/^(\+212|0)[5-7][0-9]{8}$/, {
        message: 'Phone must be a valid Moroccan number (+212XXXXXXXXX or 0XXXXXXXXX)',
    })
    phone: string;

    @IsOptional()
    @IsString()
    @Matches(/^(\+212|0)[5-7][0-9]{8}$/, {
        message: 'WhatsApp must be a valid Moroccan number',
    })
    whatsapp?: string;

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    app_roles: string[];
}
