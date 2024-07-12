<?php

namespace App\Enums;

enum ContactInfoTypes: string
{
    case Phone = 'phone';
    case Email = 'email';
    case Whats = 'whats';
}
