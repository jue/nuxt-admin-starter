CREATE TABLE IF NOT EXISTS "wechat_user" (
	"id" text PRIMARY KEY NOT NULL,
	"wechat_subject" text NOT NULL,
	"openid" text,
	"unionid" text,
	"nickname" text,
	"avatar_url" text,
	"raw_profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_login_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wechat_user" ADD CONSTRAINT "wechat_user_wechat_subject_unique" UNIQUE("wechat_subject");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wechat_session" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wechat_session" ADD CONSTRAINT "wechat_session_token_hash_unique" UNIQUE("token_hash");
--> statement-breakpoint
ALTER TABLE "wechat_session" ADD CONSTRAINT "wechat_session_user_id_wechat_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."wechat_user"("id") ON DELETE cascade ON UPDATE no action;
