<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('login')->unique();
            $table->string('password');
            $table->string('email');
            $table->text('about');
            $table->string('register_ip');
            $table->string('last_login_ip');
            $table->boolean('is_admin');
            $table->boolean('is_subscribed');
            $table->datetime('registered_at');
            $table->datetime('last_login_at');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
