<?php

declare(strict_types=1);

header('Content-Type: application/json');

const MONSTER_FALLBACK_IMAGE = 'https://via.placeholder.com/100?text=Monster';

function randomValueByType(string $type): int
{
    return match ($type) {
        'monster' => random_int(10, 30),
        'treasure' => random_int(10, 25),
        'potion' => random_int(10, 20),
        'trap' => random_int(5, 20),
        default => 0,
    };
}

function randomMonsterSeed(int $monsterIndex): string
{
    $suffix = bin2hex(random_bytes(3));
    return "monster_{$monsterIndex}_{$suffix}";
}

function monsterImageUrl(string $seed): string
{
    if ($seed === '') {
        return MONSTER_FALLBACK_IMAGE;
    }

    $encodedSeed = rawurlencode($seed);
    return "https://api.dicebear.com/7.x/identicon/svg?seed={$encodedSeed}";
}

function createField(int $id, string $type, int $monsterIndex = 0): array
{
    $image = null;

    if ($type === 'monster') {
        $seed = randomMonsterSeed($monsterIndex);
        $image = monsterImageUrl($seed);

        if ($image === '') {
            $image = MONSTER_FALLBACK_IMAGE;
        }
    }

    return [
        'id' => $id,
        'type' => $type,
        'value' => randomValueByType($type),
        'image' => $image,
    ];
}

function buildFieldTypes(): array
{
    return array_merge(
        array_fill(0, 5, 'monster'),
        array_fill(0, 4, 'treasure'),
        array_fill(0, 3, 'potion'),
        array_fill(0, 4, 'trap')
    );
}

function generateLevel(): array
{
    $types = buildFieldTypes();
    $fields = [];
    $monsterCount = 0;

    foreach ($types as $index => $type) {
        if ($type === 'monster') {
            $monsterCount++;
        }

        $fields[] = createField($index, $type, $monsterCount);
    }

    shuffle($fields);

    return ['grid' => $fields];
}

echo json_encode(generateLevel(), JSON_THROW_ON_ERROR);