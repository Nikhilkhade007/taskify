import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workspace = pgTable('workspace',{
    id : uuid("id").defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at',{
        withTimezone: true,
        mode: "string"
    }),
    workspaceOwner:uuid("workspace_owner").notNull(),
    title:text("title").notNull(),
    iconId:text("icon_id").notNull(),
    data: text('data'),
    inTash: text('in_tash'),
    logo: text('logo'),
    bannerUrl: text('banner_url'),
    

})
