<?php

use App\Http\Controllers\Frontend\BandMemberController;
use App\Http\Controllers\Frontend\ConfigurationsController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\EventsController;
use App\Http\Middleware\LogAccess;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::get('/bla', function (Request $request) {
//     // return response()->json(['random' => rand()]);
//     return response()->json(User::all());
// });

Route::controller(ConfigurationsController::class)->prefix('config')->group(function () {
    Route::get('/get-all', 'getAll')->middleware([LogAccess::class]);
});

Route::controller(BandMemberController::class)->prefix('band-member')->group(function () {
    Route::get('/get-all', 'getAll');
});

Route::controller(EventsController::class)->prefix('events')->group(function () {
    Route::get('/future', 'getFutureEvents');
});

Route::controller(ContactController::class)->prefix('contact')->group(function () {
    Route::post('/', 'createContact');
});

