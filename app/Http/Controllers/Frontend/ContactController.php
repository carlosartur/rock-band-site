<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\ErrorDefaultResponseService;
use App\Services\SendContactNotificationEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;
use Throwable;

class ContactController extends Controller
{
    use ReCaptchaTrait;

    public function createContact(Request $request)
    {
        try {
            App::setLocale('pt-BR');

            $this->validateRequest($request);
            $this->validateReCaptcha($request);

            $contact = new Contact();

            $contact->name = $request->input('name');
            $contact->email = $request->input('email');
            $contact->subject = $request->input('subject', "");
            $contact->message = $request->input('message');
            $contact->ip = $request->ip();

            $contact->setDates();

            $contact->save();

            return response()->json(['message' => 'Success!', 'data' => $contact], 201);
        } catch (Throwable $exception) {
            return ErrorDefaultResponseService::responseByException($exception);
        }
    }

    /**
     * Validate a put/post request
     *
     * @param Request $request
     * @return array
     */
    public function validateRequest(Request $request): array
    {
        return Validator::make($request->all(), [
            "name" => "required|max:512",
            "email" => "required|max:512|email:rfc,dns",
            "subject" => "required|max:512",
            "message" => "required",
        ])
        ->stopOnFirstFailure(true)
        ->validate();
    }
}
