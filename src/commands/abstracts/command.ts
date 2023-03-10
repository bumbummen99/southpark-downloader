import container, { Container } from '../../ioc/container.js';

export default abstract class Command {
  /**
   * The name of the command.
   */
  public abstract name: string;

  /**
   * The description of the command.
   */
  public abstract description: string;

  /**
   * The arguments of the command.
   */
  public args: { [name: string]: { description?: string, defaultValue?: any } } = {};

  /**
   * The options of the command.
   */
  public options: { [flags: string]: { description?: string, defaultValue?: any } } = {};

  /**
   * Reference to the Container.
   */
  protected container: Container;

  /**
   * Initialize the command and set the container property.
   */
  constructor() {
    this.container = container;
  }

  /**
   * Execute the command.
   */
  public abstract execute(): void|Promise<void>;
}
