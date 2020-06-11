import ASN from 'asn1.js';

export const BootSignature = ASN.define('BootSignature', function () {
  this.seq().obj(
    this.key('formatVersion').int(),
    this.key('certificate').any(),
    this.key('algorithmIdentifier').seq().obj(
      this.key('algorithm').objid(),
      this.optional().key('parameters').any()
    ),
    this.key('authenticatedAttributes').seq().obj(
      this.key('target').printstr(),
      this.key('length').int()
    ),
    this.key('signature').octstr()
  );
});

export function parseVerifiedBoot1(buffer) {
  try {
    const footer = Buffer.from(buffer.read());
    const bootsig = BootSignature.decode(footer, 'der');
    bootsig.formatVersion = Number(bootsig.formatVersion);
    bootsig.authenticatedAttributes.length = Number(bootsig.authenticatedAttributes.length);
    return bootsig;
  } catch (e) {
    return null;
  }
}
