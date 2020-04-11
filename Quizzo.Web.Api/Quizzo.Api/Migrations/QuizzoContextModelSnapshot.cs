﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Quizzo.Api.Models;

namespace Quizzo.Api.Migrations
{
    [DbContext(typeof(QuizzoContext))]
    partial class QuizzoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Quizzo.Api.Models.Answer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AnswerText")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("LastUpdatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<int?>("QuestionId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("Quizzo.Api.Models.Participant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("LastUpdatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("QuizRoomId")
                        .HasColumnType("int");

                    b.Property<int>("Rank")
                        .HasColumnType("int");

                    b.Property<int>("Score")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("QuizRoomId");

                    b.ToTable("Participants");
                });

            modelBuilder.Entity("Quizzo.Api.Models.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("CorrectAnswerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("LastUpdatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<string>("QuestionText")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("QuizRoomId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CorrectAnswerId");

                    b.HasIndex("QuizRoomId");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("Quizzo.Api.Models.QuizRoom", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AdminCode")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsReady")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime?>("LastUpdatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("RoomCode")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<DateTime?>("StartedAtUtc")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("StoppedAtUtc")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("QuizRooms");
                });

            modelBuilder.Entity("Quizzo.Api.Models.Response", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("AnswerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("LastUpdatedOnUtc")
                        .HasColumnType("datetime");

                    b.Property<int?>("ParticipantId")
                        .HasColumnType("int");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<long>("ResponseTime")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("AnswerId");

                    b.HasIndex("ParticipantId");

                    b.HasIndex("QuestionId");

                    b.ToTable("Responses");
                });

            modelBuilder.Entity("Quizzo.Api.Models.Answer", b =>
                {
                    b.HasOne("Quizzo.Api.Models.Question", null)
                        .WithMany("Answers")
                        .HasForeignKey("QuestionId");
                });

            modelBuilder.Entity("Quizzo.Api.Models.Participant", b =>
                {
                    b.HasOne("Quizzo.Api.Models.QuizRoom", "QuizRoom")
                        .WithMany("Participants")
                        .HasForeignKey("QuizRoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Quizzo.Api.Models.Question", b =>
                {
                    b.HasOne("Quizzo.Api.Models.Answer", "CorrectAnswer")
                        .WithMany()
                        .HasForeignKey("CorrectAnswerId");

                    b.HasOne("Quizzo.Api.Models.QuizRoom", "QuizRoom")
                        .WithMany("Questions")
                        .HasForeignKey("QuizRoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Quizzo.Api.Models.Response", b =>
                {
                    b.HasOne("Quizzo.Api.Models.Answer", "Answer")
                        .WithMany()
                        .HasForeignKey("AnswerId");

                    b.HasOne("Quizzo.Api.Models.Participant", null)
                        .WithMany("Responses")
                        .HasForeignKey("ParticipantId");

                    b.HasOne("Quizzo.Api.Models.Question", "Question")
                        .WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
