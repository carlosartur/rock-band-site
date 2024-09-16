<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandMemberController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\ConfigurationsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\StatesController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::controller(AuthController::class)->prefix('admin-auth')->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('refresh', 'refresh');
    Route::group(['middleware' => 'auth:jwt'], function () {
        Route::post('logout', 'logout');
        Route::get('user', 'user');
    });
});

Route::get('/csrf-token', function () {
    return Response::json(['csrf_token' => csrf_token()]);
});

/** Front-end routes */
Route::prefix('admin')->group(function () {
    Route::controller(StatesController::class)->prefix('states')->group(function () {
        Route::get('/cities/{id}', 'getAllCities');
        Route::get('/get-by-postcode/{postcode}', 'getCityAndStateByPostcode');
    });
});

Route::prefix('admin')->middleware('auth:jwt')->group(function () {

    Route::get('/get-csrf-token', function (Request $request) {
        $token = $request->session()->token();

        return response()->json(['csrf_token' => $token]);
    });

    Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
        Route::get('/', 'getDasboardInfo');
    });

    Route::controller(CitiesController::class)->prefix('cities')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/state/{acronym}', 'getAllCitiesByState');
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(StatesController::class)->prefix('states')->group(function () {
        Route::get('/all', 'getAll');
    });

    Route::controller(UsersController::class)->prefix('users')->group(function () {
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(EventsController::class)->prefix('events')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/all', 'getAll');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(ContactInfoController::class)->prefix('contact_info')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/all', 'getAll');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(GalleryController::class)->prefix('gallery')->group(function () {
        Route::get('/proportions', 'getAllProportions');
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(ContactController::class)->prefix('contact')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(NewsletterController::class)->prefix('newsletter')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(NewsController::class)->prefix('news')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(ConfigurationsController::class)->prefix('configurations')->group(function () {
        Route::get('/all', 'getAll');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(PagesController::class)->prefix('pages')->group(function () {
        Route::get('/export-to-csv', 'exportToCsv');
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById')->where('id', '[0-9]+');;
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });

    Route::controller(BandMemberController::class)->prefix('band_member')->group(function () {
        Route::get('/', 'search');
        Route::get('/{id}', 'getOneById');
        Route::put('/{id?}', 'store');
        Route::post('/', 'store');
        Route::delete('/', 'delete');
    });
});


Route::get('/{any?}', function ($any = null) {
    $path = base_path('frontend/build/' . $any);

    if ($any && File::exists($path)) {
        $mimeType = mime_content_type($path);

        if (preg_match('/\.(css|js)$/', $path) && !in_array($mimeType, ['text/css', 'application/javascript'])) {
            $mimeType = preg_match('/\.css$/', $path) ? 'text/css' : 'application/javascript';
        }

        return response()->file($path, [
            'Content-Type' => $mimeType
        ]);
    }

    return response()->file(base_path('frontend/build/index.html'));
})->where('any', '.*');
