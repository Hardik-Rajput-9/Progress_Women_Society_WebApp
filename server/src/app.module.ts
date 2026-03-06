import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProgramsModule } from "./programs/programs.module";
import { DonationsModule } from "./donations/donations.module";
import { VolunteersModule } from "./volunteers/volunteers.module";
import { AuthModule } from "./auth/auth.module";
import { validationSchema } from "./config/env.validation";
import { DashboardModule } from "./dashboard/dashboard.module";
import { EventsModule } from "./events/events.module";
import { PostsModule } from './posts/posts.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    ProgramsModule,
    DonationsModule,
    VolunteersModule,
    AuthModule,
    DashboardModule,
    EventsModule,
    PostsModule,
    GalleryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
