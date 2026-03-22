import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLSchema, GraphQLError } from "graphql";

/**
 * Transforms the schema by wrapping resolvers that have the @auth directive.
 * 
 * @param schema The GraphQL schema to transform
 * @param directiveName The name of the directive to look for (default: "auth")
 */
export function authDirectiveTransformer(schema: GraphQLSchema, directiveName: string = "auth") {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName) => {
      const directives = getDirective(schema, fieldConfig, directiveName);
      const authDirective = directives?.[0];

      if (authDirective) {
        const { action, object } = authDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          const { enforcer, casbinSubjects } = context;

          if (!enforcer || !casbinSubjects) {
            throw new GraphQLError("Authorization context missing", {
              extensions: { code: "UNAUTHENTICATED" },
            });
          }

          let authorized = false;
          // Check if ANY of the user's subjects (roles/sub) have permission
          for (const sub of casbinSubjects) {
            if (await enforcer.enforce(sub, object, action)) {
              authorized = true;
              break;
            }
          }

          if (!authorized) {
            throw new GraphQLError(`Forbidden: No permission to ${action} ${object}`, {
              extensions: { 
                code: "FORBIDDEN",
                action,
                object
              },
            });
          }

          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}
