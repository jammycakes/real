export interface BlockSignatureNode {
  type: "block-signature";
  text: string;
}

export interface DirectiveNode {
  type: "directive";
  text: string;
}

export interface BlockBodyNode {
  type: "block-body";
  statements: StatementNode[];
}

export interface BlockNode {
  type: "block";
  signature: BlockSignatureNode;
  body: BlockBodyNode;
}

export type StatementNode = DirectiveNode | BlockNode;

export interface DocumentNode {
  type: "document";
  body: BlockBodyNode;
}

export type AST = DocumentNode;
