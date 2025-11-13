import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/appConfig.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { AuthorModule } from './modules/author/author.module';
import { SearchModule } from './modules/search/search.module';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { GraphqlConfigModule } from './config/graphql-config.module';
import { CacheConfigModule } from './config/cache-config.module';
import { ThrottlerConfigModule } from './config/throttler-config.module';

@Module({
  imports: [
    GraphqlConfigModule,
    CacheConfigModule,
    ThrottlerConfigModule,
    AuthModule,
    AppConfigModule,
    DatabaseModule,
    UserModule,
    BookModule,
    AuthorModule,
    SearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule {}
