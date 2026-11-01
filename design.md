# Authentication requests — issue 275

Design mock only. All references are synthetic. Open index.html directly or serve locally; no dependencies or network calls. Native Kubernetes provider owns these adapters, not generic base-ui. No named mock skill was available; approved #249 workflow used. Reviewed against web-design-guidelines skill and its fetched guideline source.

## API and ownership

Kubernetes v1.35.0, authentication.k8s.io/v1; API module v0.35.0. None of these payloads is a saved editable resource. There is no list, update, delete, status editor, metadata editor, or resource-name form. 'Edit request' changes only the unsubmitted local draft. All status paths are server-owned.

| Component | Destination / permission | Controls → exact paths |
| --- | --- | --- |
| TokenReview | POST /apis/authentication.k8s.io/v1/tokenreviews; cluster scoped; create tokenreviews | Password input → spec.token; repeatable audience rows → spec.audiences[]; omitted audience list uses API server audience |
| SelfSubjectReview | POST /apis/authentication.k8s.io/v1/selfsubjectreviews; cluster scoped; create selfsubjectreviews | No spec inputs. Current connection context only; existing impersonation affects server answer, never editable here |
| TokenRequest | POST /api/v1/namespaces/{namespace}/serviceaccounts/{name}/token; namespaced core subresource; create serviceaccounts/token | Namespace/account picker → URL, not payload identity; audience rows → spec.audiences[]; integer-string seconds → spec.expirationSeconds; omitted lifetime stays omitted; binding selector/reference → spec.boundObjectRef.{apiVersion,kind,name,uid} |

Binding references are same-namespace Pod/Secret or cluster-scoped Node in this baseline. Reference UID must come from resolved object, never a guessed executable default. Fixture UID is clearly synthetic. Bound-object validation, TokenRequestServiceAccountUIDValidation and ServiceAccountNodeBindingValidation feature behavior must follow actual server discovery/configuration. No permission, support, or validity inferred from schema.

Response projections: TokenReview status.authenticated, status.audiences, status.error, status.user.{username,uid,groups[],extra[key][]}; SelfSubjectReview status.userInfo.{username,uid,groups[],extra[key][]}; TokenRequest status.token and status.expirationTimestamp. Identity and token fields remain masked. Error text needs sensitive-content filtering before display. Audience mismatch blocks acceptance even with authenticated true. Server expiration is authoritative; requested duration is not a guarantee.

## Interaction and source boundary

1000×700 reference frame, 32px controls, 13px text, 20×24px padding, 180px navigation. Internal scroll, destination and footer stay visible. Inline errors remain visible. Audience help opens on focus, hover or click; Escape closes help and retains focus. Real typing, native selects, audience insertion/removal, review/edit, fixture failure states, source switch and narrow viewport exercised.

Source is deliberately a read-only redacted projection. It is never submitted, parsed back, or copied as credentials. Unknown/invalid source scratchpad preserves exact comments, large integer spelling and malformed text across modes, but is explicitly independent: no claim of bidirectional/lossless YAML editing. No raw sensitive source or reveal exists. No persistence/storage API exists; explicit mode preference persistence remains unimplemented in this isolated action mock. Drafts last only for the page lifetime. Audience draft is shared across the three mock previews; production should scope drafts by action/destination.

The mock requires nonempty explicit TokenRequest audiences and a supplied TokenReview token as product guidance. Server validation remains authoritative. Lifetime validation follows pinned Kubernetes range 600..4294967296 seconds. References distinguish loading, empty, denied and unavailable; results distinguish not executed, denied, missing endpoint, transport failure, unauthenticated and masked fixture result. Switching fixture availability does not prove real RBAC enforcement. Review never sends POST or creates a credential.

## Reuse and remaining boundaries

Faithful standalone HTML composition, not shipped React. Reuse existing Dialog, FormField, Input(type=password), Select/Combobox, Button, Tooltip/Popover, Collapsible, and repeatable Input rows. No new generic primitive required. Native semantics belong in Kubernetes adapter. Production must add existing Dialog focus trap/opener restoration, independent per-action draft lifecycle, explicit mode preference, capability guards, async cancellation, redaction of server errors/identity, actual reference resolution and response handling. No request execution, clipboard, raw import, credential reveal or server validation is claimed.

Guideline review: semantic buttons/labels, visible focus, masked controls, responsive grid and no motion. Reference state announcements use aria-live. Audience row group label and inline field error associations need production FormField wiring; mock does not claim full accessibility conformance.

## Sources

- https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L52056-L52287
- https://github.com/kubernetes/api/blob/v0.35.0/authentication/v1/types.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/authentication/validation/validation.go
- https://github.com/omniviewdev/omniview/issues/262
- https://github.com/omniviewdev/omniview/issues/249
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74

## Captures

00 initial TokenReview; 01 missing-token validation; 02 populated masked token and audience help; 03 redacted source; 04 unsupported-source scratchpad; 05 audience mismatch; 06 denied POST; 07 SelfSubjectReview inspection; 08 masked identity result; 09 TokenRequest validation; 10 bound Pod request; 11 issuance consequence/review and masked result; 12 denied reference lookup; 13 narrow 600×800 frame. Main captures: 1440×900 CSS pixels at deviceScaleFactor 1.25 (1800×1125 PNG). Every captured state visually inspected in contact sheet. Initial shared browser capture failure resolved using dedicated Chrome profile; profile is excluded from publication.
