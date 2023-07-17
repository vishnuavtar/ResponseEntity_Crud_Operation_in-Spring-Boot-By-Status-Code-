export class WFN {
  constructor(
    public cpe_version: string = '2.3',
    public part: string = '*',
    public vendor: string = '*',
    public product: string = '*',
    public version: string = '*',
    public update: string = '*',
    public edition: string = '*',
    public language: string = '*',
    public sw_edition: string = '*',
    public target_sw: string = '*',
    public target_hw: string = '*',
    public other: string = '*'
  ) {}

  getCPEUri(): string {
    // cpe:<cpe_version>:<part>:<vendor>:<product>:<version>:<update>:<edition>:<language>:<sw_edition>:<target_sw>:<target_hw>:<other>

    // Regexp for replacing spaces with underscore character
    const searchRegExp = /\s/g;
    const replaceWith = '_';

    let part = this.part.toLowerCase();
    if (part === '') {
      part = '*';
    } else {
      if (part === 'hardware') {
        part = 'h';
      } else if (part === 'os') {
        part = 'o';
      } else if (part === 'software' || part === 'middleware' || part === 'other') {
        part = 'a';
      }
    }

    let vendor = this.vendor.trim().toLowerCase();
    if (vendor === '') {
      vendor = '*';
    }
    vendor = vendor.replace(searchRegExp, replaceWith);

    let product = this.product.trim().toLowerCase();
    if (product === '') {
      product = '*';
    }
    product = product.replace(searchRegExp, replaceWith);

    let version = this.version.trim().toLowerCase();
    if (version === '') {
      version = '*';
    }
    version = version.replace(searchRegExp, replaceWith);

    return (
      'cpe' +
      ':' +
      this.cpe_version +
      ':' +
      part +
      ':' +
      vendor +
      ':' +
      product +
      ':' +
      version +
      ':' +
      this.update +
      ':' +
      this.edition +
      ':' +
      this.language +
      ':' +
      this.sw_edition +
      ':' +
      this.target_sw +
      ':' +
      this.target_hw +
      ':' +
      this.other
    );
  }
}
