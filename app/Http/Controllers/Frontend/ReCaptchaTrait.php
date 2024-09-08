<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Configurations;
use Exception;
use Illuminate\Http\Request;

trait ReCaptchaTrait
{
    /**
     * Validate ReCAPTCHA from request
     *
     * @param Request $request
     * @return void
     */
    public function validateReCaptcha(Request $request): void
    {
        $recaptchaSecretKey = Configurations::getOneBySlug("chave-secreta-recaptcha")?->getValue();
        $recaptchaToken = $request->input('recaptcha') ?? $request->input('params')['recaptcha'] ?? false;

        if (!$recaptchaToken) {
            throw new Exception('ReCAPTCHA inválido, por favor, tente novamente');
        }

        $recaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify";
        $recaptchaResponse = file_get_contents($recaptchaVerificationUrl . "?secret=" . $recaptchaSecretKey . "&response=" . $recaptchaToken);
        $recaptchaData = json_decode($recaptchaResponse);

        if (!$recaptchaData->success) {
            throw new Exception('ReCAPTCHA inválido, por favor, tente novamente');
        }
    }
}
