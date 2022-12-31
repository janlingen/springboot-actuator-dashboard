export class Trace {
  constructor(
    public timestamp: Date,
    public method: String,
    public uri: String,
    public status: String,
    public timeTaken: String
  ) {}
}
