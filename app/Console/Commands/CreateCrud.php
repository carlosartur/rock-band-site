<?php

namespace App\Console\Commands;

use App\Models\TablePropertyData;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Services\CreateControllerByTableService;
use App\Services\CreateModelByTableService;
use App\Services\CreateReactViewForm;
use App\Services\CreateRoutesByTableService;
use App\Services\CreateReactViewList;
use Throwable;

class CreateCrud extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-crud
                            {table : The name of the table}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    private ?CreateControllerByTableService $createControllerByTableService = null;

    private ?CreateModelByTableService $createModelByTableService = null;

    private ?CreateRoutesByTableService $createRoutesByTableService = null;

    private ?CreateReactViewList $createReactViewList = null;

    private ?CreateReactViewForm $createReactViewForm = null;

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            $tableName = $this->argument('table');

            if (!$tableName) {
                $this->error("Table {$tableName} empty!");
                return;
            }

            if (!$this->hasTableGiven($tableName)) {
                $this->error("Table {$tableName} does not exists!");
                return;
            }

            $this->info("Read properties from {$tableName}...");
            $tableProperties = array_map(fn ($item) => new TablePropertyData($item),  DB::select("DESC {$tableName};"));

            $this->getCreateModelByTableService()->create($tableName, $tableProperties);
            $this->getCreateControllerByTableService()->create($tableName, $tableProperties);
            $this->getCreateReactViewList()->create($tableName, $tableProperties);
            $this->getCreateReactViewForm()->create($tableName, $tableProperties);
            $this->getCreateRoutesByTableService()->create($tableName, $tableProperties);
        } catch (Throwable $throwable) {
            $this->error($throwable->getMessage());
        }
    }

    private function hasTableGiven(string $tableName): bool
    {
        $allTables = DB::select('SHOW TABLES;');

        $dbName = env("DB_DATABASE");

        foreach ($allTables as $table) {
            if ($tableName == $table->{"Tables_in_{$dbName}"}) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get the value of createControllerByTableService
     */ 
    public function getCreateControllerByTableService(): CreateControllerByTableService
    {
        if (!$this->createControllerByTableService) {
            $this->createControllerByTableService = new CreateControllerByTableService();
        }

        return $this->createControllerByTableService;
    }


    /**
     * Get the value of createModelByTableService
     */ 
    public function getCreateModelByTableService(): CreateModelByTableService
    {
        if (!$this->createModelByTableService) {
            $this->createModelByTableService = new CreateModelByTableService();
        }

        return $this->createModelByTableService;
    }

    /**
     * Get the value of createRoutesByTableService
     */ 
    public function getCreateRoutesByTableService(): CreateRoutesByTableService
    {
        if (!$this->createRoutesByTableService) {
            $this->createRoutesByTableService = new CreateRoutesByTableService();
        }

        return $this->createRoutesByTableService;
    }

    /**
     * Get the value of createRoutesByTableService
     */ 
    public function getCreateReactViewList(): CreateReactViewList
    {
        if (!$this->createReactViewList) {
            $this->createReactViewList = new CreateReactViewList();
        }

        return $this->createReactViewList;
    }

    /**
     * Get the value of createRoutesByTableService
     */ 
    public function getCreateReactViewForm(): CreateReactViewForm
    {
        if (!$this->createReactViewForm) {
            $this->createReactViewForm = new CreateReactViewForm();
        }

        return $this->createReactViewForm;
    }
}
