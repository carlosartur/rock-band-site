<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SetupDatabase extends Command
{
    protected $signature = 'setup:database';
    protected $description = 'Setup database and user';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Conecte-se ao MySQL como root
        config(['database.connections.mysql.database' => null]);
        $rootConnection = DB::connection('mysql_root');

        // Verifique se o banco de dados existe
        $databaseName = env('DB_DATABASE', 'homestead');
        $userName = env('DB_USERNAME', 'homestead');
        $password = env('DB_PASSWORD', 'secret');

        $databases = $rootConnection->select('SHOW DATABASES LIKE ?', [$databaseName]);

        if (empty($databases)) {
            $rootConnection->statement("CREATE DATABASE $databaseName");
            $this->info("Database '$databaseName' created.");
        } else {
            $this->info("Database '$databaseName' already exists.");
        }

        // Verifique se o usuário existe
        $users = $rootConnection->select('SELECT user FROM mysql.user WHERE user = ?', [$userName]);

        if (empty($users)) {
            $rootConnection->statement("CREATE USER '$userName'@'%' IDENTIFIED BY '$password'");
            $rootConnection->statement("GRANT ALL PRIVILEGES ON $databaseName.* TO '$userName'@'%'");
            $rootConnection->statement("FLUSH PRIVILEGES");
            $this->info("User '$userName' created and granted privileges on '$databaseName'.");
        } else {
            $this->info("User '$userName' already exists.");
        }
    }
}
