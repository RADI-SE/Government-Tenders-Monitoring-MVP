/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ArchivedTenders from "../ArchivedTenders.js";
import type * as aiAnalysis from "../aiAnalysis.js";
import type * as attachments from "../attachments.js";
import type * as queries from "../queries.js";
import type * as tasks from "../tasks.js";
import type * as tenders from "../tenders.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ArchivedTenders: typeof ArchivedTenders;
  aiAnalysis: typeof aiAnalysis;
  attachments: typeof attachments;
  queries: typeof queries;
  tasks: typeof tasks;
  tenders: typeof tenders;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
