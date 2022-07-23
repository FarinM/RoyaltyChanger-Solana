import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as web3 from '@solana/web3.js'

export const creatorBeet = new beet.BeetArgsStruct(
    [
        ['address', beetSolana.publicKey],
        ['verified', beet.bool],
        ['share', beet.u8],
    ],
    'Creator',
);


export const collectionBeet = new beet.BeetArgsStruct(
    [
        ['verified', beet.bool],
        ['key', beetSolana.publicKey],
    ],
    'Collection',
);

export const UseMethod = {
    Burn: "Burn",
    Multiple: "Multiple",
    Single: "Single",
}

export const useMethodBeet = beet.fixedScalarEnum(UseMethod);

export const usesBeet = new beet.BeetArgsStruct(
    [
        ['useMethod', useMethodBeet],
        ['remaining', beet.u64],
        ['total', beet.u64],
    ],
    'Uses',
);

export const dataV2Beet = new beet.FixableBeetArgsStruct(
    [
        ['name', beet.utf8String],
        ['symbol', beet.utf8String],
        ['uri', beet.utf8String],
        ['sellerFeeBasisPoints', beet.u16],
        ['creators', beet.coption(beet.array(creatorBeet))],
        ['collection', beet.coption(collectionBeet)],
        ['uses', beet.coption(usesBeet)],
    ],
    'DataV2',
);

export const updateMetadataAccountArgsV2Beet =
    new beet.FixableBeetArgsStruct(
        [
            ['data', beet.coption(dataV2Beet)],
            ['updateAuthority', beet.coption(beetSolana.publicKey)],
            ['primarySaleHappened', beet.coption(beet.bool)],
            ['isMutable', beet.coption(beet.bool)],
        ],
        'UpdateMetadataAccountArgsV2',
    );

export const UpdateMetadataAccountV2Struct = new beet.FixableBeetArgsStruct(
    [
        ['instructionDiscriminator', beet.u8],
        ['updateMetadataAccountArgsV2', updateMetadataAccountArgsV2Beet],
    ],
    'UpdateMetadataAccountV2InstructionArgs',
);