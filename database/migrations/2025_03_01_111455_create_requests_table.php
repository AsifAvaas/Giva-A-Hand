<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->bigInteger('request_id')->unique(); // Custom 10-digit ID
            $table->bigInteger('seeker_id')->unsigned();
            $table->bigInteger('helper_id')->unsigned();
            $table->string('helper_type'); // Stores 'volunteers', 'doctors', or 'blood_donors'
            $table->text('message');
            $table->boolean('status')->default(false); // Default: Not approved
            $table->timestamps();

            // Foreign key for seeker_id (users table)
            $table->foreign('seeker_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('requests');
    }
}
