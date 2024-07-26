<?php
namespace App\Http\Controllers\Frontend;
use App\Models\AbstractModel;
use App\Models\BandMember;



class BandMemberController extends Controller
{
    public $with = ['photo'];

    /**
     * @inheritDoc
     */
    protected function getModel(): AbstractModel
    {
        return new BandMember();
    }
}