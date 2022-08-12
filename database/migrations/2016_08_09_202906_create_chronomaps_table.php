<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChronomapsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chronomaps', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description');
            $table->string('url');
            $table->string('lang');
            $table->integer('copy_of_map_id');
            $table->integer('current_version');
            $table->boolean('is_deleted');
            $table->boolean('is_published');
            $table->boolean('is_ready');
            $table->boolean('is_open_editing');
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
        Schema::drop('chronomaps');
    }
}
