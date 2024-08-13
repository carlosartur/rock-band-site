<?php
namespace App\Http\Controllers\Frontend;
use App\Models\AbstractModel;
use App\Models\BandMember;



class BandMemberController extends Controller
{
    protected const GET_ALL_ORDER_BY = ['order', 'ASC'];

    public $with = ['photo'];

    /**
     * @inheritDoc
     */
    protected function getModel(): AbstractModel
    {
        return new BandMember();
    }
}